package dev.chinhcd.backend.services;

import dev.chinhcd.backend.dtos.request.PaymentRequest;
import dev.chinhcd.backend.dtos.request.PaymentSuccessRequest;
import dev.chinhcd.backend.dtos.response.PurchaseHistoryResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;

public interface IPaymentService {
    String createPaymentUrl(PaymentRequest request, HttpServletRequest httpRequest) throws UnsupportedEncodingException;

    String querryTransaction(PaymentRequest request, HttpServletRequest req) throws IOException;

    void paymentSuccessfully(PaymentSuccessRequest request);

    List<PurchaseHistoryResponse> purchaseHistory();
}
