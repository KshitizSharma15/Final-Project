using CogniProject.Models;
using System.Collections.Generic;

namespace CogniProject.Repository
{
    public interface IShiftReqRepository
    {
        IEnumerable<ShiftReq> GetAllRequests();
        ShiftReq GetRequestById(int requestId);
        IEnumerable<ShiftReq> GetShiftReqByEmpId(int empid);

        int AddRequest(ShiftReq request);
        int UpdateRequestStatus(int requestId, string status);
        int DeleteRequest(int requestId);

    }
}