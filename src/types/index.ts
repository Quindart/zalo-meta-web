export const ROLE_TYPES = {
    CAPTAIN: 'captain',
    MEMBER: 'member',
    SUB_CAPTAIN: 'sub_captain'
};

export const getRoleLabel = (role?: string) => {
    switch (role) {
        case ROLE_TYPES.CAPTAIN:
            return 'Trưởng nhóm';
        case ROLE_TYPES.SUB_CAPTAIN:
            return 'Phó nhóm';
        default:
            return 'Thành viên';
    }
};

export interface AssignRoleParams {
    channelId: string;
    userId: string;
    targetUserId: string;
    newRole: 'captain' | 'member' | 'sub_captain';
};
