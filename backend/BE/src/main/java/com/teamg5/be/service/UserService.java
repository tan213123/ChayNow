package com.teamg5.be.service;

import com.teamg5.be.dto.UserProfileResponse;
import com.teamg5.be.dto.UserProfileUpdateRequest;
import com.teamg5.be.dto.ChangePasswordRequest;

public interface UserService {
    UserProfileResponse getMyProfile();
    UserProfileResponse updateMyProfile(UserProfileUpdateRequest request);
    void changePassword(ChangePasswordRequest request);
}
