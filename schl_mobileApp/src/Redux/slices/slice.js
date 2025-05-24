import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    p_students: [],
}

export const studentSlice = createSlice({
    name: 'students',
    initialState,
    reducers: {
        setStudentArray: (state, action) => {
            state.p_students = action.payload
        },

        updateStudentStatus: (state, action) => {

            const { studentIds, newStatus } = action.payload;

            state.p_students = state.p_students.map((student) => {
                if (studentIds.includes(student._id)) {
                    if (student.studentStatus) {
                        return {
                            ...student,
                            studentStatus: {
                                ...student.studentStatus,
                                status: newStatus,
                            },
                        };
                    } else {
                        return {
                            ...student,
                            studentStatus: {
                                studentId: student._id,
                                status: newStatus,
                                updatedAt: new Date().toISOString(),
                            },
                        };
                    }
                }
                return student;
            });
        },

    },
})

export const { setStudentArray, updateStudentStatus } = studentSlice.actions;

export default studentSlice.reducer