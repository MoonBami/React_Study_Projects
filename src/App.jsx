import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [memoTitle, setMemoTitle] = useState('')
  const [body, setBody] = useState('')
  const [posts, setPosts] = useState([])

  const [showModal, setShowModal] = useState(false)
  const [editPostId, setEditPostId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')

  const isBody = () => {
    if (body.split(' ').join('').length == 0) {
      console.log('내용을 입력하세요')
    }
    else {
      const newPost = {
        id: Date.now().toString(),
        title: memoTitle,
        body: body
      }
      setPosts([newPost, ...posts])
      setMemoTitle('')
      setBody('')
    }
  }
  const openEditModal = (post) => {
    setEditPostId(post.id)
    setEditTitle(post.title)
    setEditBody(post.body)
    setShowModal(true)
  }

  const saveEdit = () => {
    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === editPostId ? { ...p, title: editTitle, body: editBody } : p
      )
    )
    setShowModal(false)
    setEditPostId(null)
  }

  return (
    <div className="App">
      <div className="title">
        <h1>메모장</h1>
      </div>
      <div className="inputBox">
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={memoTitle}
          onChange={(e) => setMemoTitle(e.target.value)}
        />
        <br />
        <textarea
          placeholder="내용을 입력하세요"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
        <br />
        <button onClick={
          isBody
        }>저장</button>
      </div>
      <div className="listBox"></div>
      {posts.map((post) => (
        <div key={post.id} className="post">
          <h2>{post.title}</h2>
          <p>{post.body}</p>
          <button onClick={() => {
            setPosts(posts.filter((p) => p.id !== post.id))
          }}>삭제</button>
          <button onClick={() => openEditModal(post)}>
            수정</button>
        </div>
      ))}

      {/* 모달 */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>메모 수정</h2>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <br />
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
            ></textarea>
            <br />
            <button onClick={saveEdit}>저장</button>
            <button onClick={() => setShowModal(false)}>취소</button>
          </div>
        </div>
      )}

      {/* 모달 CSS */}
      <style>{`
        .modal {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex; justify-content: center; align-items: center;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 10px;
          width: 400px;
        }
        input, textarea {
          width: 100%;
        }
      `}</style>
    </div>



  )
}

export default App
