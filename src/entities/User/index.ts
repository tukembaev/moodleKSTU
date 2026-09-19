import { createFavoriteSubject, deleteFavoriteSubject, getUserInfo, registerToCourse } from './model/userAPI'
import { userQueries } from './model/userQueryFactory'
import UserProfile from './ui/UserProfile'
import {Favorites ,ResidesCourse,
    ResidesTheme , UserGroupList , UserProfileData,UserFilesList } from './types/user'
import UserBilling from './ui/UserBilling'
import {
  DEPARTMENT_PERMISSION,
  hasDepartmentAccess,
  hasPermission,
} from './lib/permissions'
import { useHasPermission } from './model/useHasPermission'
export type {Favorites ,ResidesCourse,
    ResidesTheme , UserGroupList ,UserProfileData,UserFilesList}
export { getUserInfo, userQueries ,UserProfile , registerToCourse , createFavoriteSubject,deleteFavoriteSubject,

    UserBilling,
    DEPARTMENT_PERMISSION,
    hasDepartmentAccess,
    hasPermission,
    useHasPermission,
}

