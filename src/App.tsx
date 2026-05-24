import { useState } from 'react'
import './App.css'

function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`
}

const initialQuestions = [
  {
    id: 'q1',
    text: 'Công ty nào to nhất thế giới?',
    type: 'single',
    options: [
      { id: 'q1_opt1', text: 'Google', isCorrect: false },
      { id: 'q1_opt2', text: 'Facebook', isCorrect: true },
      { id: 'q1_opt3', text: 'Amazon', isCorrect: false },
    ],
  },
  {
    id: 'q2',
    text: 'Những công ty nào là của Việt Nam?',
    type: 'multiple',
    options: [
      { id: 'q2_opt1', text: 'Google', isCorrect: false },
      { id: 'q2_opt2', text: 'Facebook', isCorrect: false },
      { id: 'q2_opt3', text: 'Viettel', isCorrect: true },
      { id: 'q2_opt4', text: 'FPT', isCorrect: true },
    ],
  },
]

function App() {
  const [questions, setQuestions] = useState(initialQuestions)

  function handleDeleteQuestion(qid: string) {
    if (window.confirm('⚠️ Bạn có chắc muốn xóa câu hỏi này?')) {
      setQuestions(prev => prev.filter(q => q.id !== qid))
    }
  }

  function handleDeleteOption(qid: string, optId: string) {
    setQuestions(prev => prev.map(q => {
      if (q.id !== qid) return q
      let options = q.options.filter(o => o.id !== optId)
      if (options.length === 0) {
        options = [{ id: generateId('opt'), text: '', isCorrect: false }]
      }
      return { ...q, options }
    }))
  }

  function handleAddOption(qid: string) {
    setQuestions(prev => prev.map(q => {
      if (q.id !== qid) return q
      return {
        ...q,
        options: [...q.options, { id: generateId('opt'), text: '', isCorrect: false }],
      }
    }))
  }

  function handleQuestionTextChange(qid: string, text: string) {
    setQuestions(prev => prev.map(q => q.id === qid ? { ...q, text } : q))
  }

  function handleQuestionTypeChange(qid: string, newType: string) {
    setQuestions(prev => prev.map(q => {
      if (q.id !== qid || newType === q.type) return q
      const options = q.options.map(o => ({ ...o }))
      if (newType === 'single' && q.type === 'multiple') {
        const correctIdx = options.findIndex(o => o.isCorrect)
        options.forEach(o => { o.isCorrect = false })
        if (correctIdx !== -1) {
          options[correctIdx].isCorrect = true
        }
      }
      return { ...q, type: newType, options }
    }))
  }

  function handleOptionTextChange(qid: string, optId: string, text: string) {
    setQuestions(prev => prev.map(q => {
      if (q.id !== qid) return q
      return {
        ...q,
        options: q.options.map(o => o.id === optId ? { ...o, text } : o),
      }
    }))
  }

  function handleCorrectChange(qid: string, optId: string, checked: boolean) {
    setQuestions(prev => prev.map(q => {
      if (q.id !== qid) return q
      if (q.type === 'single' && checked) {
        return {
          ...q,
          options: q.options.map(o => ({ ...o, isCorrect: o.id === optId })),
        }
      }
      if (q.type === 'single' && !checked) {
        return {
          ...q,
          options: q.options.map(o => o.id === optId ? { ...o, isCorrect: false } : o),
        }
      }
      return {
        ...q,
        options: q.options.map(o => o.id === optId ? { ...o, isCorrect: checked } : o),
      }
    }))
  }

  function handleAddQuestion() {
    setQuestions(prev => [
      {
        id: generateId('q'),
        text: 'Câu hỏi mới',
        type: 'single',
        options: [
          { id: generateId('opt'), text: '', isCorrect: false },
          { id: generateId('opt'), text: '', isCorrect: false },
        ],
      },
      ...prev,
    ])
  }

  return (
    <div className="container quiz-builder-container">
      
      <div className="quiz-card">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
          <h3 className="mb-0 fw-bold"><i className="fas fa-pen-ruler me-2 text-primary"></i>Trình tạo Quiz</h3>
          <div className="action-buttons-global">
            <button className="btn btn-outline-primary" onClick={handleAddQuestion}>
              <i className="fas fa-plus-circle me-1"></i> Thêm câu hỏi
            </button>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="alert alert-light text-center border rounded-4 p-5 my-3">
            <i className="fas fa-clipboard-list fa-2x mb-3 text-secondary"></i>
            <h5 className="fw-normal">Chưa có câu hỏi nào</h5>
            <p className="text-muted">Nhấn nút <strong>+ Thêm câu hỏi</strong> để bắt đầu tạo quiz.</p>
          </div>
        ) : (
          questions.map(question => (
            <div key={question.id} className="question-card">
              <div className="question-header">
                <input
                  type="text"
                  className="form-control"
                  value={question.text}
                  onChange={e => handleQuestionTextChange(question.id, e.target.value)}
                  placeholder="Nhập câu hỏi..."
                />
                <select
                  className="form-select"
                  value={question.type}
                  onChange={e => handleQuestionTypeChange(question.id, e.target.value)}
                >
                  <option value="single">Một đáp án đúng</option>
                  <option value="multiple">Nhiều đáp án đúng</option>
                </select>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <i className="fas fa-trash-can"></i>
                </button>
              </div>
              <div className="options-list mt-3">
                {question.options.map(opt => (
                  <div key={opt.id} className="option-item">
                    <input
                      type="text"
                      className="form-control option-text"
                      value={opt.text}
                      onChange={e => handleOptionTextChange(question.id, opt.id, e.target.value)}
                      placeholder="Lựa chọn mới"
                    />
                    <div className="correct-flag">
                      <input
                        type={question.type === 'single' ? 'radio' : 'checkbox'}
                        name={`correct_${question.id}`}
                        className="correct-input"
                        checked={opt.isCorrect}
                        onChange={e => handleCorrectChange(question.id, opt.id, e.target.checked)}
                      />
                      <span className="small text-secondary">Đúng</span>
                    </div>
                    <button
                      className="delete-option-btn"
                      onClick={() => handleDeleteOption(question.id, opt.id)}
                    >
                      <i className="fas fa-times-circle"></i>
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="btn add-option-btn w-100 mt-2 py-2"
                onClick={() => handleAddOption(question.id)}
              >
                <i className="fas fa-plus me-1"></i> Thêm lựa chọn
              </button>
            </div>
          ))
        )}

        
      </div>

      <div className="feature-bullets">
        <h3><i className="fas fa-list-check me-2"></i>Chức năng của ứng dụng tạo Quiz</h3>
        <ul>
          <li><strong>Tạo câu hỏi đa dạng</strong> – Hỗ trợ câu hỏi dạng một đáp án đúng và dạng nhiều đáp án đúng.</li>
          <li><strong>Thêm / Xóa câu hỏi linh hoạt</strong> – Thêm câu hỏi mới, mỗi câu hỏi có nút xóa riêng.</li>
          <li><strong>Quản lý tùy chọn (options) cho mỗi câu hỏi</strong> – Mỗi câu hỏi có nút <strong>“+ Thêm lựa chọn”</strong> để thêm lựa chọn, kèm nút xóa từng option.</li>
          <li><strong>Xác định đáp án đúng trực quan</strong> – Với single choice: hiển thị radio để đánh dấu <strong>1 đáp án đúng</strong>. Với multiple choice: dùng checkbox, cho phép chọn <strong>nhiều đáp án đúng</strong>.</li>
          <li><strong>Sửa nội dung câu hỏi & lựa chọn</strong> – Ô nhập văn bản cho phép chỉnh sửa câu hỏi và từng option một cách dễ dàng.</li>
          <li><strong>Thay đổi loại câu hỏi bất kỳ lúc nào</strong> – Chuyển đổi giữa single/multiple choice, dữ liệu đáp án đúng được chuyển đổi thông minh.</li>
        </ul>
      </div>
    </div>
  )
}

export default App
