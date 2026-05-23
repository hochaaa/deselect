const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+~\-={}[\]:;"'<>,.?/\\|]+$/;
const nameRegex = /^[a-zA-Z가-힣]+$/;

export function validateSignUpForm({ email, password, name }) {
  if (!emailRegex.test(email)) return '유효한 이메일 주소를 입력해주세요.';

  if (!nameRegex.test(name) && name !== 'DE:SELECT') {
    return '이름은 한글과 영어만 사용 가능합니다.';
  }

  if (!passwordRegex.test(password) || password.length < 6) {
    return '비밀번호는 영어, 숫자, 특수문자만 포함하여 6자리 이상이어야 합니다.';
  }

  return '';
}
