using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Models;
using DataAccessLayer.Data;
using DataAccessLayer.Interface;
using Microsoft.Extensions.Configuration;
using Stripe;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BusinessLogicLayer.Config.DatabaseObjects;

namespace BusinessLogicLayer.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private int? UserCode { get; set; }
        private readonly IDataAccess _db;
        public PaymentRepository(IDataAccess db, IJwtExtractService jwtExtractService)
        {
            UserCode = jwtExtractService.GetUserIdFromToken();
            _db = db;
        }

        public object InsertPayment(Payment payment)
        {
            string sp_name = Procedures.SP_PAYMENT.ToString();

            Parameters dyParam = new Parameters();
            dyParam.SelectedDB = _db.SelectedDatabase;

            dyParam.AddDynamicParams("PAYMENT_INTENT_ID", DbType.String, ParameterDirection.Input, payment.PaymentIntentId);
            dyParam.AddDynamicParams("AMOUNT", DbType.Decimal, ParameterDirection.Input, payment.Amount);
            dyParam.AddDynamicParams("CURRENCY", DbType.String, ParameterDirection.Input, payment.Currency);
            dyParam.AddDynamicParams("STATUS", DbType.String, ParameterDirection.Input, payment.Status);
            dyParam.AddDynamicParams("EMAIL", DbType.String, ParameterDirection.Input, payment.CustomerEmail);
            dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.INSERT.ToString());
            dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, UserCode);


            if (_db.SelectedDatabase == "ORACLE")
                dyParam.AddRefCursor("REFCURSOR");

            return _db.ExecuteProc(sp_name, dyParam);
        }

        public object UpdatePaymentStatus(string paymentIntentId, string status)
        {
            string sp_name = Procedures.SP_PAYMENT.ToString();

            Parameters dyParam = new Parameters();
            dyParam.SelectedDB = _db.SelectedDatabase;

            dyParam.AddDynamicParams("PAYMENT_INTENT_ID", DbType.String, ParameterDirection.Input, paymentIntentId);
            dyParam.AddDynamicParams("STATUS", DbType.String, ParameterDirection.Input, status);
            dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.UPDATE.ToString());
            dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, UserCode);

            if (_db.SelectedDatabase == "ORACLE")
                dyParam.AddRefCursor("REFCURSOR");

            return _db.ExecuteProc(sp_name, dyParam);
        }

        public Payment GetPaymentByIntentId(string paymentIntentId)
        {
            string sp_name = Procedures.SP_PAYMENT.ToString();

            Parameters dyParam = new Parameters();
            dyParam.SelectedDB = _db.SelectedDatabase;

            dyParam.AddDynamicParams("PAYMENT_INTENT_ID", DbType.String, ParameterDirection.Input, paymentIntentId);
            dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, UserCode);

            dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.FETCH.ToString());

            if (_db.SelectedDatabase == "ORACLE")
                dyParam.AddRefCursor("REFCURSOR");

            var result = _db.ExecuteProc(sp_name, dyParam);

            // 🔷 Map result → Payment (adjust based on your IDataAccess return type)
            return result as Payment;
        }
    }
}
