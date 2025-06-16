using CogniProject.Models;

namespace CogniProject.Services
{
    public interface IShiftReqService
    {

        IEnumerable<ShiftReq> GetAllRequests();
        ShiftReq GetRequestById(int requestId);
        IEnumerable<ShiftReq> GetRequestByEmpId(int empid);
        int AddRequest(ShiftReq request);
        int DeleteRequest(int requestId);
        int ApproveRequest(int requestId, string status);
        int RejectRequest(int requestId, string status);
    }
}