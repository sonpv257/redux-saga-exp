import { put, takeEvery, takeLatest, takeLeading, delay } from 'redux-saga/effects';
import { increment, decrement, incrementAsync, decrementAsync, incrementLatest, incrementLeading } from '../slices/counterSlice';

function* incrementAsyncSaga() {
  yield delay(1000);
  yield put(increment());
}

function* decrementAsyncSaga() {
  yield delay(1000);
  yield put(decrement());
}

function* incrementLatestSaga() {
  yield delay(1000);
  yield put(increment());
}

function* incrementLeadingSaga() {
  yield delay(1000);
  yield put(increment());
}

export default function* counterSaga() {
  yield takeEvery(incrementAsync.type, incrementAsyncSaga);
  yield takeEvery(decrementAsync.type, decrementAsyncSaga);
  yield takeLatest(incrementLatest.type, incrementLatestSaga);
  yield takeLeading(incrementLeading.type, incrementLeadingSaga);
}
