using CogniProject.Data;
using CogniProject.Models;

namespace CogniProject.Repository
{
    public class ShiftReqRepository : IShiftReqRepository
    {
        private readonly ContextDb _context;

        public ShiftReqRepository(ContextDb context)
        {
            _context = context;
        }

        public IEnumerable<ShiftReq> GetAllRequests()
        {
            return _context.ShiftReqs.ToList();
        }

        public ShiftReq GetRequestById(int requestId)
        {
            return _context.ShiftReqs.FirstOrDefault(req => req.RequestID == requestId);
        }

        public IEnumerable<ShiftReq> GetShiftReqByEmpId(int empid)
        {
            return _context.ShiftReqs.Where(s => s.EmployeeID == empid).ToList();
        }

        public int AddRequest(ShiftReq request)
        {
            request.Status = "Pending";
            _context.ShiftReqs.Add(request);
            return _context.SaveChanges();
        }

        public int UpdateRequestStatus(int requestId, string status)
        {
            var request = _context.ShiftReqs.FirstOrDefault(req => req.RequestID == requestId);
            request.Status = status;
            return _context.SaveChanges();
        }
        public int DeleteRequest(int requestId)
        {
            var request = GetRequestById(requestId);
            if (request != null)
            {
                _context.ShiftReqs.Remove(request);
                return _context.SaveChanges();
            }
            return 0;
        }
    }
}