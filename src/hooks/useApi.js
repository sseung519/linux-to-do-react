import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/to-do';

function useApi() {
    const [toDoList, setToDoList] = useState([]);

    // 데이터 가져오기
    const fetchData = async () => {
        try {
            const response = await axios.get(API_BASE_URL);
            if (response.status === 200) {
                setToDoList(response.data); // 데이터 설정
            }
        } catch (error) {
            console.error('할 일 조회 에러 발생: ', error);
        }
    };


    // 할 일 추가하기
    const addToDo = async (content) => {
        try {
            const response = await axios.post(API_BASE_URL, { content });
            if (response.status === 201) {
                await fetchData(); // 데이터를 다시 불러옴
            }
        } catch (error) {
        }
    };

    // 할 일 삭제하기
    const deleteToDo = async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/${id}`);
            if (response.status === 200) {
                await fetchData(); // 삭제 후 데이터 다시 불러오기
            }
        } catch (error) {
            console.error('할 일 삭제 에러 발생: ', error);
        }
    };

    // 할 일 수정하기
    const updateToDo = async (id, content) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/${id}`, { content });
            if (response.status === 200) {
                await fetchData(); // 수정 후 데이터를 다시 불러옵니다.
            }
        } catch (error) {
            console.error('할 일 수정 에러 발생: ', error);
        }
    };

    return { toDoList, fetchData, addToDo, updateToDo, deleteToDo };
}

export default useApi;
