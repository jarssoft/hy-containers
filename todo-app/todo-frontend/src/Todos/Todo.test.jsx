import { render, screen } from '@testing-library/react'
import Todo from './Todo'

test('renders content', () => {
  const todo = {
    text: 'Make something',
    important: true
  }

  render(<Todo todo={todo} />)

  const element = screen.getByText('Make somecthing')
  expect(element).toBeDefined() 
})