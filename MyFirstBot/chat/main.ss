+ {^hasTag('hello')} *~2
- Hi!
- Hi, how are you?
- How are you?
- Hello
- Howdy
- Ola

+ wow *
- This is
^ Awesome <cap>

+ test2 rebuild *
- Rebuilding works fine.

// "subReply" 문법
+ 안녕하세요
- {delay=1} 안녕하세요!\n
- {delay=2} 무엇을 도와드릴까요? :)

// "또는, | " 문법
+ 안녕 *
- ((안녕~!|하이!!|봉주르~~!!))

// 사용자 시나리오, "<star>" 문법
+ dlswmdtlfvo
- 저와 대화하려면 인증이 필요합니다. 성함을 입력해주세요.

// <cap>이 동작하는 케이스 1
//  + *1
//  % 저와 대화하려면 인증이 필요합니다. 성함을 입력해주세요.
//  - <cap> 님, 안녕하세요. 무엇을 도와드릴까요?

// <cap>이 동작하는 케이스 2
  + *1 *1
  % 저와 대화하려면 인증이 필요합니다. 성함을 입력해주세요.
  - <cap2> 님, 안녕하세요. 무엇을 도와드릴까요?

// "<srai>" 문법  // 주의: ~ 기호가 들어가면 비매칭으로 빠짐
+ wassup
- {@__greet__} 궁금한거 있으면 다 물어봐!!

+ bonbon
- {@__greet__}

+ __greet__
- 안녕!!
- 헬로우!!
- 곤니치와!!

// "<random>" 문법
+ *
- 무슨 말씀이신지요?
- 흠...무슨 말인지 잘 모르겠어요. 다시 말씀해주실래요?
- 제가 아직 공부중이라 많이 부족해요. 좀 더 쉽게 말씀해 주실래요?