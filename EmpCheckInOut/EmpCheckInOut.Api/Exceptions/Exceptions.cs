namespace EmpCheckInOut.Api.Exceptions
{
    public class AuthenticationException : Exception
    {
        public AuthenticationException(string message) : base(message) { }
    }

    public class ResourceNotFoundException : Exception
    {
        public ResourceNotFoundException(string resourceName, string resourceId)
            : base($"{resourceName} with ID '{resourceId}' was not found.") { }
    }

    public class BusinessRuleViolationException : Exception
    {
        public BusinessRuleViolationException(string message) : base(message) { }
    }

    public class ConflictException : Exception
    {
        public ConflictException(string message) : base(message) { }
    }
}
