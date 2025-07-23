'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { increment, decrement, incrementAsync, decrementAsync, incrementLatest, incrementLeading } from '@/redux/slices/counterSlice';

export default function Counter() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch: AppDispatch = useDispatch();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Counter</h1>
      <div className="flex items-center space-x-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => dispatch(increment())}
        >
          Tăng
        </button>
        <span className="text-xl">{count}</span>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => dispatch(decrement())}
        >
          Giảm
        </button>
      </div>
      <div className="flex items-center space-x-4 mt-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => dispatch(incrementAsync())}
        >
          Tăng Async (takeEvery)
        </button>
        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded"
          onClick={() => dispatch(decrementAsync())}
        >
          Giảm Async (takeEvery)
        </button>
      </div>
      <div className="flex items-center space-x-4 mt-4">
        <button
          className="px-4 py-2 bg-purple-500 text-white rounded"
          onClick={() => dispatch(incrementLatest())}
        >
          Tăng Async (takeLatest)
        </button>
        <button
          className="px-4 py-2 bg-pink-500 text-white rounded"
          onClick={() => dispatch(incrementLeading())}
        >
          Tăng Async (takeLeading)
        </button>
      </div>
    </div>
  );
}
