package dev.chinhcd.backend.services;

import dev.chinhcd.backend.dtos.request.PaymentRequest;
import jakarta.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

public interface IVNPayService {

    String createPaymentUrl(PaymentRequest request, HttpServletRequest httpRequest, String txn) throws UnsupportedEncodingException;

    String querryTransaction(PaymentRequest request, HttpServletRequest req) throws IOException;

}
