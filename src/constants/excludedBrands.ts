import type { VendorKey } from './vendors';

const bjMusic = [
  'rihter',
  'analog cases',
  'applause guitars',
  'boomwhackers',
  'cb percussion',
  'diamond head',
  'dr handmade strings',
  'dw hardware',
  'enki',
  'generic',
  'gewa music',
  'gretsch drums',
  'ingles',
  'j reynolds',
  'jasmine',
  'jasmine ukuleles',
  'joyo technologies',
  'medeli',
  'pacific drums & perc',
  'ping',
  'randall',
  'richter',
  'rockbag',
  'seiko',
  'stageline',
  'studiologic-fatar',
];

const coastMusic = [
  'air turn',
  'alabama',
  'angel',
  'aquila',
  'augustine',
  'boblen',
  'carlsbro',
  'delta blues',
  'g7th - the capo company',
  'generation',
  'ghs',
  'graph tech guitar',
  'green tones',
  'grover',
  'herco',
  // "hohner",
  // "hohner accordions & accessorie",
  'jay turser',
  'jpp',
  'juno',
  'jupiter',
  'jupiter parts',
  'kun',
  'leem',
  'mahalo ukuleles',
  'majestic',
  'manhasset',
  'mapex',
  'menzel',
  'mighty bright',
  'mike balter',
  'neotech',
  'rb percussion & accessories',
  'savarez',
  'sinclair (coast music)',
  'soundtech',
  'thomastik-infeld',
  'valencia',
  'vandoren',
  'xo',
];

const eriksonAudio = ['black lion audio', 'fbt', 'heritage audio'];

const eriksonMusic = [
  'alpine hearing protection',
  'cme',
  'lanikai & kohala',
  'markbass',
  'sakae',
  'schecter',
];

// const fender = ['bigsby', 'charvel', 'gretsch', 'jackson'];

const hpc = ['jem', 'martin professional'];

const sfm = [
  'avante audio',
  'atlona',
  'canare',
  'hiscox',
  'just add power',
  'kmmk solutions',
  'kosch amps',
  'leprecon',
  'luxul',
  'on-stage stands',
  'one control',
  'outlaw',
  'panamax',
  'pro control',
  'raxxess',
  'rti',
  'sfm manufacturing',
  'stewart audio',
  'teisco',
  'telex communications',
  'w-dmx',
];

const excludedBrands: Partial<{ [K in VendorKey]: string[] }> = {
  bjMusic,
  coastMusic,
  eriksonAudio,
  eriksonMusic,
  // fender,
  hpc,
  sfm,
};

export default excludedBrands;
