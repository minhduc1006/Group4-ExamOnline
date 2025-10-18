package dev.chinhcd.backend.services;

import dev.chinhcd.backend.dtos.request.SupportRequestRequest;

public interface ISupportService {
    Boolean sendSupportRequest(SupportRequestRequest request);
}
