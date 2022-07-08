import { atomWithReset } from 'jotai/utils';

export interface IBase64Atom {
  encode: string;
  preventEncode: boolean;
  decode: string;
  preventDecode: boolean;
}

export interface IBase64Popover {
  decodeCopyPopover: boolean;
  encodeCopyPopover: boolean;
}

export const base64Atom = atomWithReset<IBase64Atom>({
  encode: '',
  preventEncode: false,
  decode: '',
  preventDecode: false,
});

export const base64PopupAtom = atomWithReset<IBase64Popover>({
  decodeCopyPopover: false,
  encodeCopyPopover: false,
});
