"""OTP generation utility."""

import random
import string


def generate_otp(length: int = 6) -> str:
    """Generate a numeric OTP of the given length."""
    return "".join(random.choices(string.digits, k=length))


def generate_dispatch_otp(length: int = 4) -> str:
    """Generate a short numeric dispatch OTP (shared between customer & worker)."""
    return "".join(random.choices(string.digits, k=length))
