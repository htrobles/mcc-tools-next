export const vendors = [
  {
    label: 'BJ Music',
    value: 'bjMusic',
  },
  {
    label: 'Coast Music',
    value: 'coastMusic',
  },
  {
    label: 'Erikson Audio',
    value: 'eriksonAudio',
  },
  {
    label: 'Erikson Music',
    value: 'eriksonMusic',
  },
  {
    label: 'Erikson Pro',
    value: 'eriksonPro',
  },
  {
    label: 'Fender',
    value: 'fender',
  },
  {
    label: 'Hoshino',
    value: 'hoshino',
  },
  {
    label: 'HPC',
    value: 'hpc',
  },
  {
    label: 'Sabian',
    value: 'sabian',
  },
  {
    label: 'SFM',
    value: 'sfm',
  },
  {
    label: 'Music City Canada',
    value: 'mcc',
  },
] as const;

export type VendorKey = (typeof vendors)[number]['value'];
