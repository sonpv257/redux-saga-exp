# Giải thích về Redux và Redux Saga (với Redux Toolkit)

Tài liệu này giải thích các khái niệm về Redux và Redux Saga được sử dụng trong ví dụ.

### 1. Redux và Redux Toolkit

**Redux**

Redux là một thư viện giúp quản lý trạng thái (state) của ứng dụng một cách tập trung và có thể dự đoán được. Toàn bộ state của ứng dụng được lưu trữ trong một "store" duy nhất.

**Redux Toolkit**

Redux Toolkit là bộ công cụ chính thức, được khuyên dùng để viết code Redux. Nó giúp đơn giản hóa và giảm thiểu code cần viết so với Redux truyền thống.

**Các thành phần chính trong project:**

- **Store**:
  - Là nơi lưu trữ toàn bộ state.
  - **Trong project:** `src/redux/store.ts` sử dụng `configureStore` của Redux Toolkit để tạo store và tự động tích hợp các công cụ hữu ích như Redux DevTools.

- **Slice**:
  - Một "lát cắt" của Redux store. `createSlice` từ Redux Toolkit cho phép định nghĩa reducer và action cho một phần của state một cách gọn gàng.
  - **Trong project:** `src/redux/slices/counterSlice.ts`
    - `name`: Tên của slice, dùng để tạo tiền tố cho action types (ví dụ: `counter/increment`).
    - `initialState`: Trạng thái ban đầu cho slice này.
    - `reducers`: Một object chứa các hàm reducer. `createSlice` sẽ tự động tạo ra các **action creators** tương ứng với mỗi hàm reducer này.

  ```javascript
  // src/redux/slices/counterSlice.ts
  const counterSlice = createSlice({
    name: 'counter',
    initialState: { value: 0 },
    reducers: {
      increment: (state) => {
        state.value += 1; 
      },
      // Action này chỉ để kích hoạt Saga
      incrementAsync: (state) => { }
    },
  });
  ```

- **Action và Reducer**:
  - Với Redux Toolkit, không cần viết action types và action creators thủ công. `createSlice` đã làm điều đó.
  - Các hàm trong `reducers` object chính là các mini-reducer. Chúng có thể "thay đổi" state trực tiếp nhờ thư viện Immer được tích hợp sẵn, giúp code an toàn và dễ đọc hơn.

- **Dispatch**:
  - Là hàm để gửi (dispatch) một action đến store.
  - **Trong project:** Component `src/components/Counter.tsx` sử dụng hook `useDispatch()` để lấy hàm dispatch và gửi action khi người dùng click nút.

  ```javascript
  // src/components/Counter.tsx
  import { useDispatch } from 'react-redux';
  import { increment, incrementAsync } from '@/redux/slices/counterSlice';

  const dispatch = useDispatch();
  dispatch(increment()); // Dispatch action đồng bộ
  dispatch(incrementAsync()); // Dispatch action để kích hoạt Saga
  ```

### 2. Redux Saga

**Redux Saga**

Redux Saga là một middleware cho Redux giúp xử lý các **side effects** (tác dụng phụ) một cách hiệu quả. Side effects là những thứ không thể thực hiện bên trong reducer, ví dụ như:
- Gọi API để lấy dữ liệu từ server.
- Tương tác với `localStorage`.
- Các luồng logic phức tạp cần thực hiện tuần tự hoặc song song.

**Khi nào nên dùng Redux Saga?**

- Khi ứng dụng có các luồng bất đồng bộ phức tạp (ví dụ: quy trình thanh toán, đăng nhập nhiều bước).
- Khi cần kiểm soát chặt chẽ các tác vụ: hủy tác vụ, chỉ chạy tác vụ cuối cùng, tránh chạy trùng lặp.
- Khi muốn logic side effect dễ đọc và dễ test hơn.

**So sánh nhanh với Redux Thunk:**
- **Thunk**: Đơn giản, dễ học. Phù hợp cho các tác vụ bất đồng bộ cơ bản (như gọi một API và dispatch action).
- **Saga**: Mạnh mẽ hơn, linh hoạt hơn. Phù hợp cho các kịch bản phức tạp. Sử dụng Generator Functions của JavaScript.

**Các Effects (Hiệu ứng) chính của Saga:**

Effects là các object thuần túy mà Saga "yield" (trả về) cho middleware. Middleware sẽ thực thi các hiệu ứng này.

- `put(action)`: Gửi một action đến store (giống như `dispatch`).
  ```javascript
  yield put({ type: 'INCREMENT' });
  ```
- `call(fn, ...args)`: Gọi một hàm (có thể là hàm đồng bộ hoặc bất đồng bộ). Saga sẽ tạm dừng cho đến khi hàm đó hoàn thành.
  ```javascript
  const data = yield call(fetch, '/api/data');
  ```
- `take(actionType)`: Tạm dừng Saga cho đến khi một action cụ thể được dispatch.
  ```javascript
  yield take('USER_LOGIN_SUCCESS');
  ```
- `select(selector)`: Lấy một phần state từ Redux store.
  ```javascript
  const count = yield select(state => state.counter.value);
  ```
- `delay(ms)`: Tạm dừng Saga trong một khoảng thời gian.
  ```javascript
  yield delay(1000); // Chờ 1 giây
  ```

**Các Helper để lắng nghe Action:**

- `takeEvery(actionType, saga)`: Lắng nghe một action và chạy một saga mới **mỗi khi** action đó được dispatch. Các saga chạy song song.
  - **Sử dụng:** Khi muốn xử lý mọi sự kiện, ví dụ như thêm một item vào giỏ hàng.

- `takeLatest(actionType, saga)`: Lắng nghe một action. Nếu một action mới được dispatch trong khi saga trước đó vẫn đang chạy, saga cũ sẽ bị hủy và chỉ saga mới nhất được chạy.
  - **Sử dụng:** Rất hữu ích cho tính năng tìm kiếm (chỉ quan tâm đến kết quả của từ khóa cuối cùng) hoặc khi lưu dữ liệu tự động.

- `takeLeading(actionType, saga)`: Lắng nghe một action. Nếu một saga đã đang chạy, nó sẽ bỏ qua tất cả các action mới cho đến khi saga hiện tại hoàn thành.
  - **Sử dụng:** Ngăn chặn người dùng click nhiều lần vào một nút (ví dụ: nút "Submit Form").

**Áp dụng trong project:**
- **Trong project:** `src/redux/sagas/counterSaga.ts`
  ```javascript
  // src/redux/sagas/counterSaga.ts
  function* incrementAsyncSaga() {
    yield delay(1000);      // 1. Chờ 1 giây
    yield put(increment()); // 2. Dispatch action 'increment'
  }

  export default function* counterSaga() {
    // Lắng nghe action 'incrementAsync' và chạy saga tương ứng
    yield takeEvery(incrementAsync.type, incrementAsyncSaga);
    yield takeLatest(incrementLatest.type, ...);
    yield takeLeading(incrementLeading.type, ...);
  }
