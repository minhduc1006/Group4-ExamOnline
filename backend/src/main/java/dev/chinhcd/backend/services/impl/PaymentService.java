package dev.chinhcd.backend.services.impl;

import dev.chinhcd.backend.dtos.request.PaymentRequest;
import dev.chinhcd.backend.dtos.request.PaymentSuccessRequest;
import dev.chinhcd.backend.dtos.response.PurchaseHistoryResponse;
import dev.chinhcd.backend.models.Payment;
import dev.chinhcd.backend.models.User;
import dev.chinhcd.backend.repository.IPaymentRepository;
import dev.chinhcd.backend.services.IPaymentService;
import dev.chinhcd.backend.services.IUserService;
import dev.chinhcd.backend.services.IVNPayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService implements IPaymentService {
    private final IVNPayService ivnPayService;
    private final IUserService userService;
    private final IPaymentRepository paymentRepository;

    @Transactional
    @Override
    public String createPaymentUrl(PaymentRequest request, HttpServletRequest httpRequest) throws UnsupportedEncodingException {
        User user = userService.getUserById(request.id());

        paymentRepository.deleteByUserIdAndIsPaid(user.getId(), false);

        Payment payment = new Payment();
        payment.setUser(user);
        payment.setAccountType(request.accountType());
        payment.setAmount(request.amount());
        payment.setIsPaid(false);

        String txn;
        do {
            txn = UUID.randomUUID().toString().replace("-", "").substring(0, 32);
        } while (!paymentRepository.getPaymentByVnp_txn_ref(txn).isEmpty());
        log.info("txn: {}", txn);
        payment.setVnp_TxnRef(txn);
        paymentRepository.save(payment);

        return ivnPayService.createPaymentUrl(request, httpRequest, txn);
    }

    @Override
    public String querryTransaction(PaymentRequest request, HttpServletRequest req) throws IOException {
        return ivnPayService.querryTransaction(request, req);
    }

    @Override
    public void paymentSuccessfully(PaymentSuccessRequest request) {
        Payment payment = paymentRepository.getPaymentByVnp_txn_ref(request.vnp_TxnRef()).getFirst();
        if(payment == null) {
            throw new RuntimeException("Payment not found");
        }

        User user = userService.getUserById(payment.getUser().getId());
        user.setAccountType(payment.getAccountType());
        LocalDate nextYear = LocalDate.now().plusYears(1);
        user.setExpiredDatePackage(Date.valueOf(nextYear));
        userService.saveUser(user);

        payment.setVnp_BankTranNo(request.vnp_BankTranNo());
        payment.setVnp_TransactionNo(request.vnp_TransactionNo());
        payment.setIsPaid(true);
        payment.setCompletedAt(request.completedAt());
        paymentRepository.save(payment);
    }

    @Override
    public List<PurchaseHistoryResponse> purchaseHistory() {
        User user = userService.getCurrentUser();
        List<Payment> p = paymentRepository.getByUserId(user.getId());
        return p.stream().map(pm -> {
            return new PurchaseHistoryResponse(pm.getAccountType().name(),
                    pm.getVnp_TxnRef(), pm.getVnp_BankTranNo(), pm.getVnp_TransactionNo(),
                    pm.getCompletedAt(), pm.getAmount());
        }).collect(Collectors.toList());
    }
}
