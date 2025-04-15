import { run } from './main';
import { patchCryptoForAct } from './utils/fix-crypto';

// Only patch if it's missing (e.g. when running under act)
patchCryptoForAct();

/**
 * The main function that runs the action.
 */
run();
