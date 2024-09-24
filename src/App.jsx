import './App.css';
import Header from "./components/Header.jsx";
import TodoEditor from "./components/TodoEditor.jsx";
import TodoList from "./components/TodoList.jsx";
import { useRef, useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = 'http://localhost:8080/api/to-do'; // 서버 주소에 맞게 수정

function App() {
    const [todo, setTodo] = useState([]);
    const idRef = useRef(1);


    // 초기 데이터를 서버에서 가져오는 함수
    const fetchData = async () => {
        try {
            const response = await axios.get(API_BASE_URL);
            if (response.status === 200) {
                setTodo(response.data); // 서버에서 가져온 데이터를 상태로 설정
            }
        } catch (error) {
            console.error("할 일 목록을 가져오는 중 오류 발생: ", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const onCreate = async (content) => {
        const newItem = {
            id: idRef.current,
            content,
            isDone: false,
            createdDate: new Date().getTime().toLocaleString(),
        };

        try {
            const response = await axios.post(API_BASE_URL, newItem); // 서버에 새 할 일을 추가
            if (response.status === 201) {
                await fetchData();
            }
        } catch (error) {
            console.error("할 일을 추가하는 중 오류 발생: ", error);
        }
    };


    const onUpdate = async (targetId) => {
        const targetTodo = todo.find((it) => it.id === targetId);
        if (targetTodo) {
            try {
                const response = await axios.put(`${API_BASE_URL}/${targetId}`, {
                    ...targetTodo,
                    isDone: !targetTodo.isDone,
                });
                if (response.status === 200) {
                    setTodo(todo.map((it) =>
                        it.id === targetId ? { ...it, isDone: !it.isDone } : it
                    ));
                }
            } catch (error) {
                console.error("할 일을 업데이트하는 중 오류 발생: ", error);
            }
        }
    };
    const onDelete = async (targetId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/${targetId}`);
            if (response.status === 200) {
                setTodo(todo.filter((it) => it.id !== targetId));
            }
        } catch (error) {
            console.error("할 일을 삭제하는 중 오류 발생: ", error);
        }
    };
    return (
        <div className="App">
            <Header />
            <TodoEditor onCreate={onCreate} />
            <TodoList todo={todo} onUpdate={onUpdate} onDelete={onDelete} />
        </div>
    );
}

export default App;
