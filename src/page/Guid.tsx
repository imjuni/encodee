import styled from '@emotion/styled';
import {
  AppShell,
  Button,
  Checkbox,
  Container,
  Group,
  Popover,
  Radio,
  RadioGroup,
  Space,
  Text,
  Title,
  Box,
  NumberInput,
} from '@mantine/core';
import { useAtom, useAtomValue } from 'jotai';
import { useResetAtom, useUpdateAtom } from 'jotai/utils';
import { invert, isFalse, populate } from 'my-easy-fp';
import { nanoid } from 'nanoid';
import Polyglot from 'node-polyglot';
import { useCallback, useRef } from 'react';
import ClipboardJS from 'clipboard';
import * as uuid from 'uuid';
import NavHeader from '../component/NavHeader';
import { guidCountAtom, guidOptionAtom, guidsAtom, guidsPopoverAtom } from '../store/guid';

const StW140CheckBox = styled(Checkbox)`
  width: 140px;
`;

const GuidTypeRatioGroup = () => {
  const [guidOptionStore, setGuidOptionStore] = useAtom(guidOptionAtom);
  const [guidCountStore, setGuidCountStore] = useAtom(guidCountAtom);

  return (
    <Group>
      <RadioGroup value={guidOptionStore.type}>
        <Radio
          style={{ width: 140 }}
          value="v1"
          label="v1"
          onClick={() => setGuidOptionStore((prev) => ({ ...prev, type: 'v1' }))}
        />
        <Radio
          style={{ width: 140 }}
          value="v4"
          label="v4"
          onClick={() => setGuidOptionStore((prev) => ({ ...prev, type: 'v4' }))}
        />
      </RadioGroup>
      <Box>
        <NumberInput
          defaultValue={1}
          min={1}
          max={100}
          value={guidCountStore.count}
          onChange={(value) =>
            setGuidCountStore((prev) => ({
              ...prev,
              count: value ?? 1,
            }))
          }
          placeholder="enter number of GUID"
          label="How many GUIDs want?(1-100)"
        />
      </Box>
    </Group>
  );
};

const GuidGenerateOption = () => {
  const [guidOptionStore, setGuidOptionStore] = useAtom(guidOptionAtom);

  return (
    <>
      <Group>
        <StW140CheckBox
          checked={guidOptionStore.isUpperCase}
          label="Uppercase"
          onChange={() =>
            setGuidOptionStore((prev) => ({ ...prev, isUpperCase: invert(prev.isUpperCase) }))
          }
        />
        <StW140CheckBox
          checked={guidOptionStore.isBrace}
          label="Braces"
          onChange={() =>
            setGuidOptionStore((prev) => ({ ...prev, isBrace: invert(prev.isBrace) }))
          }
        />
        <StW140CheckBox
          checked={guidOptionStore.isHyphens}
          label="Hyphens"
          onChange={() =>
            setGuidOptionStore((prev) => ({ ...prev, isHyphens: invert(prev.isHyphens) }))
          }
        />
      </Group>

      <Space h="xs" />

      <Group>
        <StW140CheckBox
          checked={guidOptionStore.encodeBase64}
          label="Base64"
          onChange={() =>
            setGuidOptionStore((prev) => ({ ...prev, encodeBase64: invert(prev.encodeBase64) }))
          }
        />
        <StW140CheckBox
          checked={guidOptionStore.encodeRFC7515}
          label="PFC 7515"
          onChange={() =>
            setGuidOptionStore((prev) => ({ ...prev, encodeRFC7515: invert(prev.encodeRFC7515) }))
          }
        />
        <StW140CheckBox
          checked={guidOptionStore.encodeUrl}
          label="URL encode"
          onChange={() =>
            setGuidOptionStore((prev) => ({ ...prev, encodeUrl: invert(prev.encodeUrl) }))
          }
        />
      </Group>
    </>
  );
};

function useOnHandleGenerateGuid() {
  const guidCount = useAtomValue(guidCountAtom);
  const guidOption = useAtomValue(guidOptionAtom);
  const setGuidsStore = useUpdateAtom(guidsAtom);

  const onHandleGenerateGuid = useCallback(() => {
    const guids = populate(guidCount.count).map(() => {
      const uid = guidOption.type === 'v1' ? uuid.v1() : uuid.v4();

      let optionApplied = uid;

      if (guidOption.isUpperCase) {
        optionApplied = optionApplied.toUpperCase();
      }

      if (isFalse(guidOption.isHyphens)) {
        optionApplied = optionApplied.replace(/-/g, '');
      }

      if (guidOption.isBrace) {
        optionApplied = `{${optionApplied}}`;
      }

      if (guidOption.encodeBase64) {
        optionApplied = atob(optionApplied);
      }

      // https://www.techengineer.one/base64-url-safe-encoding-decoding-rfc-7515/
      // encoding, decoding
      if (guidOption.encodeRFC7515) {
        optionApplied = optionApplied.replace('=', ''); // Remove any trailing '='s
        optionApplied = optionApplied.replace('+', '-'); // 62nd char of encoding
        optionApplied = optionApplied.replace('/', '_'); // 63rd char of encoding
      }

      if (guidOption.encodeUrl) {
        optionApplied = encodeURIComponent(optionApplied);
      }

      return optionApplied;
    });

    setGuidsStore(() => ({ guids }));
  }, [guidCount, guidOption, setGuidsStore]);

  return onHandleGenerateGuid;
}

const GuidButtonGroup = () => {
  const guidsStore = useAtomValue(guidsAtom);
  const [guidsPopoverStore, setGuidsPopoverStore] = useAtom(guidsPopoverAtom);
  const clipboardRef = useRef<Record<string, ClipboardJS>>({});

  const onHandleRef = useCallback((ref?: HTMLButtonElement | null) => {
    if (ref !== null && ref !== undefined) {
      clipboardRef.current.btn = new ClipboardJS('.copy-button', { container: ref as any });
    }
  }, []);

  return (
    <Group>
      {guidsStore.guids.map((guid) => {
        return (
          <Popover
            style={{ width: '100%' }}
            key={nanoid()}
            opened={guidsPopoverStore[guid] ?? false}
            onClose={() => setGuidsPopoverStore((prev) => ({ ...prev, [guid]: false }))}
            target={
              <Button
                className="copy-button"
                data-clipboard-text={guid}
                ref={(ref?: HTMLButtonElement | null) => onHandleRef(ref)}
                style={{ width: '100%' }}
                key={nanoid()}
                onClick={() => {
                  setGuidsPopoverStore((prev) => ({ ...prev, [guid]: true }));
                  setTimeout(() => {
                    setGuidsPopoverStore((prev) => ({ ...prev, [guid]: false }));
                  }, 1000);
                }}
              >
                {guid}
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
        );
      })}
    </Group>
  );
};

const ButtonGroup = () => {
  const onHandleGenerateGuid = useOnHandleGenerateGuid();
  const resetGuidsStore = useResetAtom(guidsAtom);
  const resetGuidOptionStore = useResetAtom(guidOptionAtom);

  return (
    <Group>
      <Button style={{ width: '40%' }} onClick={() => onHandleGenerateGuid()}>
        Generate
      </Button>
      <Button
        style={{ width: '40%' }}
        onClick={() => {
          resetGuidsStore();
          resetGuidOptionStore();
        }}
      >
        Reset
      </Button>
    </Group>
  );
};

const Guid: React.FC<{ t: Polyglot['t'] }> = () => {
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
        <Title order={1}>Guid Generator</Title>

        <Space h="md" />

        <GuidTypeRatioGroup />

        <Space h="sm" />

        <GuidGenerateOption />

        <Space h="sm" />

        <ButtonGroup />

        <Space h="sm" />

        <GuidButtonGroup />
      </Container>
      {/* Your application here */}
    </AppShell>
  );
};

export default Guid;
