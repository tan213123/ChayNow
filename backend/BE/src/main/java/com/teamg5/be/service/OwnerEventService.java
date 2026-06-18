package com.teamg5.be.service;

import com.teamg5.be.dto.CreateEventRequest;
import com.teamg5.be.dto.OwnerEventResponse;

public interface OwnerEventService {
    OwnerEventResponse createOwnerEvent(CreateEventRequest request);
}
