import {
  LuCheck,
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuExternalLink,
  LuInfo,
  LuLoaderCircle,
  LuMenu,
  LuPencil,
  LuPlus,
  LuSearch,
  LuSettings,
  LuTrash2,
  LuUser,
  LuX,
} from 'react-icons/lu';
import { createIcon } from '../lib/create-icon.jsx';

/** Icon for add/create actions. */
export const AddIcon = createIcon(LuPlus, 'AddIcon');

/** Icon for successful, selected, or confirmed states. */
export const CheckIcon = createIcon(LuCheck, 'CheckIcon');

/** Icon for downward disclosure and select controls. */
export const ChevronDownIcon = createIcon(
  LuChevronDown,
  'ChevronDownIcon'
);

/** Icon for backward navigation. */
export const ChevronLeftIcon = createIcon(LuChevronLeft, 'ChevronLeftIcon');

/** Icon for forward navigation. */
export const ChevronRightIcon = createIcon(
  LuChevronRight,
  'ChevronRightIcon'
);

/** Icon for close, dismiss, and cancel actions. */
export const CloseIcon = createIcon(LuX, 'CloseIcon');

/** Icon for destructive delete actions. */
export const DeleteIcon = createIcon(LuTrash2, 'DeleteIcon');

/** Icon for edit actions. */
export const EditIcon = createIcon(LuPencil, 'EditIcon');

/** Icon for links that navigate outside the current surface. */
export const ExternalLinkIcon = createIcon(
  LuExternalLink,
  'ExternalLinkIcon'
);

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
