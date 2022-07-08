import {
  AppShell,
  Button,
  Container,
  Group,
  Popover,
  Space,
  Stack,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import ClipboardJS from 'clipboard';
import fastSafeStringify from 'fast-safe-stringify';
import { useAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { isFalse } from 'my-easy-fp';
import Polyglot from 'node-polyglot';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as Rx from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import NavHeader from '../component/NavHeader';
import { base64Atom, base64PopupAtom } from '../store/base64';

interface IRxPayload {
  data: string;
  type: 'encode' | 'decode';
}

const Base64: React.FC<{ t: Polyglot['t'] }> = () => {
  const [subject] = useState(new Rx.Subject<IRxPayload>());
  const [base64Store, setBase64Store] = useAtom(base64Atom);
  const [base64PopupStore, setBase64PopupStore] = useAtom(base64PopupAtom);
  const resetBase64Store = useResetAtom(base64Atom);
  const clipboardRef = useRef<Record<string, ClipboardJS>>({});

  const onHandleRef = useCallback((ref?: HTMLButtonElement | null) => {
    if (ref !== null && ref !== undefined) {
      clipboardRef.current.btn = new ClipboardJS('.copy-button', { container: ref as any });
    }
  }, []);

  // 한글이 제대로 디코딩되지 않아서 찾아보니 나온 문서
  // https://velog.io/@latte_h/Base64-%EC%B2%98%EB%A6%AC
  const onHandleRxEncode = useCallback((payload: IRxPayload) => {
    try {
      if (payload.type === 'encode') {
        const decode = decodeURIComponent(escape(atob(payload.data)));
        setBase64Store((prev) => ({ ...prev, decode, preventDecode: true }));
      } else {
        const encode = btoa(unescape(encodeURIComponent(payload.data)));
        setBase64Store((prev) => ({ ...prev, encode, preventEncode: true }));
      }
      return true;
    } catch {
      return false;
    }
  }, []);

  const onHandleSetEncode = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (isFalse(base64Store.preventEncode)) {
        setBase64Store((prev) => ({
          ...prev,
          encode: event.currentTarget.value,
          preventDecode: true,
        }));
        subject.next({ data: event.currentTarget.value, type: 'encode' });
      } else {
        setBase64Store((prev) => ({ ...prev, preventEncode: false }));
      }
    },
    [subject, setBase64Store],
  );

  const onHandleSetDecode = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (isFalse(base64Store.preventDecode)) {
        setBase64Store((prev) => ({
          ...prev,
          decode: event.currentTarget.value,
          preventDecode: true,
        }));
        subject.next({ data: event.currentTarget.value, type: 'decode' });
      } else {
        setBase64Store((prev) => ({ ...prev, preventDecode: false }));
      }
    },
    [subject, setBase64Store],
  );

  const onHandleClickPretty = useCallback(() => {
    try {
      const data = base64Store.decode;
      const stringified = fastSafeStringify(JSON.parse(data), undefined, 2);
      setBase64Store((prev) => ({ ...prev, decode: stringified, preventDecode: true }));
      return true;
    } catch {
      return false;
    }
  }, [base64Store]);

  // https://stackoverflow.com/questions/71149561/react-unsubscribe-from-rxjs-subscription-in-useeffect
  // textarea에 변화가 생기고, store 변화가 생기면서 Base64 자체가 re-render 된다. 이 때 useEffect가
  // 재실행되는데 이렇게 mount/unmount가 반복되면서 rxjs 구독/해지가 빠르게 반복되며 문제가 되는 것 같다
  // 맞다, store 변경이 되면서 textarea가 빠르게 re-render 되면서 구독과 구독해제가 빠르게 중첩되며
  // sub 구독 상태를 끊어지게 만든다
  // 즉, rx sub/unsub는 store 변경에 의해서 sub/unsub이 되지 않도록 안배를 해야 한다.
  useEffect(() => {
    const subscriber = subject.pipe(debounceTime(300)).subscribe(onHandleRxEncode);

    return () => {
      subscriber.unsubscribe();
    };
    // 하지만 나는 귀찮으니 아래처럼 원타임 구독/구독해제로 그냥함
  }, []);

  return (
    <AppShell
      padding="md"
      header={<NavHeader />}
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      })}
    >
      <Container>
        <Title order={1}>Base64 Encode & Decode</Title>
        <Space h="md" />
        <Group>
          <Stack style={{ flex: 1 }}>
            <Textarea
              value={base64Store.encode}
              autosize
              minRows={8}
              maxRows={15}
              onChange={onHandleSetEncode}
              placeholder={'enter base64 encoded string'}
            />
          </Stack>

          <Stack>
            <Popover
              opened={base64PopupStore.encodeCopyPopover}
              onClose={() => setBase64PopupStore((prev) => ({ ...prev, encodeCopyPopover: false }))}
              target={
                <Button
                  className="copy-button"
                  data-clipboard-text={base64Store.encode}
                  ref={(ref?: HTMLButtonElement | null) => onHandleRef(ref)}
                  onClick={() => {
                    setBase64PopupStore((prev) => ({ ...prev, encodeCopyPopover: true }));
                    setTimeout(() => {
                      setBase64PopupStore((prev) => ({ ...prev, encodeCopyPopover: false }));
                    }, 1000);
                  }}
                >
                  Copy
                </Button>
              }
              width={260}
              position="bottom"
              withArrow
            >
              <div style={{ display: 'flex' }}>
                <Text size="sm">Copied!</Text>
              </div>
            </Popover>
          </Stack>
        </Group>
        <Space h="md" />

        <Group>
          {/* <Button>Decode</Button>
          <Button>Encode</Button> */}
          <Button onClick={onHandleClickPretty}>Pretty</Button>
          <Button onClick={() => resetBase64Store()}>Reset</Button>
        </Group>

        <Space h="md" />
        <Group>
          <Stack style={{ flex: 1 }}>
            <Textarea
              value={base64Store.decode}
              autosize
              minRows={8}
              maxRows={15}
              onChange={onHandleSetDecode}
              placeholder={'enter base64 decoded string'}
            />
          </Stack>

          <Stack>
            <Popover
              opened={base64PopupStore.decodeCopyPopover}
              onClose={() => setBase64PopupStore((prev) => ({ ...prev, decodeCopyPopover: false }))}
              target={
                <Button
                  className="copy-button"
                  data-clipboard-text={base64Store.decode}
                  ref={(ref?: HTMLButtonElement | null) => onHandleRef(ref)}
                  onClick={() => {
                    setBase64PopupStore((prev) => ({ ...prev, decodeCopyPopover: true }));
                    setTimeout(() => {
                      setBase64PopupStore((prev) => ({ ...prev, decodeCopyPopover: false }));
                    }, 1000);
                  }}
                >
                  Copy
                </Button>
              }
              width={260}
              position="bottom"
              withArrow
            >
              <div style={{ display: 'flex' }}>
                <Text size="sm">Copied!</Text>
              </div>
            </Popover>
          </Stack>
        </Group>
      </Container>
      {/* Your application here */}
    </AppShell>
  );
};

export default Base64;
