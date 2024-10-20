import { useAppDispatch, useAppSelector } from "../../state/hooks"
import { decrement, increment, incrementAsync, incrementByAmount } from "./counterSlice"


type Props = {}

const Counter = (props: Props) => {
  const count = useAppSelector((state) => state.counter.value) 
  const dispatch = useAppDispatch()
  return (
    <div>
      <h2>{count}</h2>
      <div>
        <button onClick={() => dispatch(incrementAsync(10))}>Increment</button>
        <button onClick={() => dispatch(decrement())}>Decrement</button>
      </div>
    </div>
  )
}

export default Counter