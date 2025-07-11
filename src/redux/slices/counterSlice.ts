import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    incrementAsync: (state) => {
      
    },
    decrementAsync: (state) => {
      
    },
    incrementLatest: (state) => {
      
    },
    incrementLeading: (state) => {
      
    }
  },
});

export const { increment, decrement, incrementByAmount, incrementAsync, decrementAsync, incrementLatest, incrementLeading } = counterSlice.actions;

export default counterSlice.reducer;
