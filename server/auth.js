const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid'); // uuid 불러오기

// 임시 유저 데이터 저장 (실제는 DB 사용)
let users = [];

// 회원가입
router.post("/register", (req, res) => {
  const { username } = req.body; // 여기 수정됨

  if (!username) {
    return res.status(400).json({ message: "아이디를 입력하세요." });
  }

  // 이미 존재하는 유저 확인
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: "이미 존재하는 아이디입니다." });
  }

  const uid = uuidv4();
  users.push({ username, uid });

  console.log("회원가입 완료:", username);
  res.status(201).json({ message: "회원가입 성공" });
});

// 로그인
router.post("/login", (req, res) => {
  const { username } = req.body;

  const user = users.find(u => u.username === username);

  if (!username || !users.find(u => u.username === username)) {
    return res.status(400).json({ message: "존재하지 않는 아이디입니다." });
  }

  console.log("로그인 성공:", username);
  res.json({ 
    message: "로그인 성공",
    username : user.username,
    uid: user.uid
  });
});

// 자신의 정보 확인용 라우터 (테스트 목적)
router.get("/:username", (req, res) => {
  const { username } = req.params;
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
  }

  res.json({ username: user.username, uid: user.uid });
});

module.exports = router;
