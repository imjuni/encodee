import { atomWithReset } from 'jotai/utils';

export interface IGuidCount {
  count: number;
}

export interface IGuidOption {
  type: 'v1' | 'v4';
  isUpperCase: boolean;
  isBrace: boolean;
  isHyphens: boolean;
  encodeBase64: boolean;
  encodeRFC7515: boolean;
  encodeUrl: boolean;
}

export interface IGuids {
  guids: string[];
}

export const guidCountAtom = atomWithReset<IGuidCount>({ count: 1 });

export const guidOptionAtom = atomWithReset<IGuidOption>({
  type: 'v4',
  isUpperCase: true,
  isBrace: false,
  isHyphens: false,
  encodeBase64: false,
  encodeRFC7515: false,
  encodeUrl: false,
});

export const guidsPopoverAtom = atomWithReset<Record<string, boolean>>({});
export const guidsAtom = atomWithReset<IGuids>({ guids: [] });
