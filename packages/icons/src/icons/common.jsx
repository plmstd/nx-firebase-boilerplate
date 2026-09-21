import { LuCheck } from '../glyphs/lu/LuCheck.js';
import { LuCircleCheckBig } from '../glyphs/lu/LuCircleCheckBig.js';
import { LuChevronDown } from '../glyphs/lu/LuChevronDown.js';
import { LuChevronLeft } from '../glyphs/lu/LuChevronLeft.js';
import { LuChevronRight } from '../glyphs/lu/LuChevronRight.js';
import { LuExternalLink } from '../glyphs/lu/LuExternalLink.js';
import { LuInfo } from '../glyphs/lu/LuInfo.js';
import { LuLoaderCircle } from '../glyphs/lu/LuLoaderCircle.js';
import { LuMenu } from '../glyphs/lu/LuMenu.js';
import { LuPencil } from '../glyphs/lu/LuPencil.js';
import { LuPlus } from '../glyphs/lu/LuPlus.js';
import { LuSearch } from '../glyphs/lu/LuSearch.js';
import { LuSettings } from '../glyphs/lu/LuSettings.js';
import { LuTrash2 } from '../glyphs/lu/LuTrash2.js';
import { LuUser } from '../glyphs/lu/LuUser.js';
import { LuTriangleAlert } from '../glyphs/lu/LuTriangleAlert.js';
import { LuCircleAlert } from '../glyphs/lu/LuCircleAlert.js';
import { LuX } from '../glyphs/lu/LuX.js';
import { FiLoader } from '../glyphs/fi/FiLoader.js';
import { GoDotFill } from '../glyphs/go/GoDotFill.js';
import { createIcon } from '../lib/create-icon.jsx';

/** Icon for add/create actions. */
export const AddIcon = createIcon(LuPlus, 'AddIcon');

/** Icon for successful, selected, or confirmed states. */
export const CheckIcon = createIcon(LuCheck, 'CheckIcon');

/** Icon for visibly confirmed or completed states. */
export const CheckCircleIcon = createIcon(LuCircleCheckBig, 'CheckCircleIcon');

/** Icon for downward disclosure and select controls. */
export const ChevronDownIcon = createIcon(LuChevronDown, 'ChevronDownIcon');

/** Icon for backward navigation. */
export const ChevronLeftIcon = createIcon(LuChevronLeft, 'ChevronLeftIcon');

/** Icon for forward navigation. */
export const ChevronRightIcon = createIcon(LuChevronRight, 'ChevronRightIcon');

/** Icon for close, dismiss, and cancel actions. */
export const CloseIcon = createIcon(LuX, 'CloseIcon');

/** Icon for destructive delete actions. */
export const DeleteIcon = createIcon(LuTrash2, 'DeleteIcon');

/** Icon for edit actions. */
export const EditIcon = createIcon(LuPencil, 'EditIcon');

/** Icon for links that navigate outside the current surface. */
export const ExternalLinkIcon = createIcon(LuExternalLink, 'ExternalLinkIcon');

/** Icon for informational states or helper text. */
export const InfoIcon = createIcon(LuInfo, 'InfoIcon');

/** Icon for loading or pending states. */
export const LoaderIcon = createIcon(LuLoaderCircle, 'LoaderIcon');

/** Icon for opening menus or navigation drawers. */
export const MenuIcon = createIcon(LuMenu, 'MenuIcon');

/** Icon for search actions and search inputs. */
export const SearchIcon = createIcon(LuSearch, 'SearchIcon');

/** Icon for settings and configuration actions. */
export const SettingsIcon = createIcon(LuSettings, 'SettingsIcon');

/** Icon for user, account, or profile surfaces. */
export const UserIcon = createIcon(LuUser, 'UserIcon');

/** Icon for warning states or helper text. */
export const WarningIcon = createIcon(LuTriangleAlert, 'WarningIcon');

/** Icon for error states or helper text. */
export const ErrorIcon = createIcon(LuCircleAlert, 'ErrorIcon');

/** Icon for loading or pending states. */
export const SpinnerIcon = createIcon(FiLoader, 'SpinnerIcon');

/** Compact filled dot used for status indicators and legends. */
export const StatusDotIcon = createIcon(GoDotFill, 'StatusDotIcon');
