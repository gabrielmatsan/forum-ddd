import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { makeAnswer } from 'test/factories/make-answer-factory'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryAnswersRepository: InMemoryAnswersRepository
// sistem under test
let sut: FetchQuestionAnswersUseCase
describe('Fetch Questions Answers', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to fetch answers by question', async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({
        createdAt: new Date(2022, 0, 20),
        questionId: new UniqueEntityID('id-1'),
      }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({
        createdAt: new Date(2023, 0, 20),
        questionId: new UniqueEntityID('id-1'),
      }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({
        createdAt: new Date(2024, 2, 19),
        questionId: new UniqueEntityID('id-1'),
      }),
    )

    const { answers } = await sut.execute({
      page: 1,
      questionId: 'id-1',
    })

    expect(answers).toHaveLength(3)
  })

  it('should be able to pagine the answers of a question', async () => {
    for (let i = 1; i <= 21; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({ questionId: new UniqueEntityID('id-1') }),
      )
    }

    const questionsPageOne = await sut.execute({
      page: 1,
      questionId: 'id-1',
    })

    const questionsPageTwo = await sut.execute({
      page: 2,
      questionId: 'id-1',
    })
    expect(questionsPageOne.answers).toHaveLength(20)
    expect(questionsPageTwo.answers).toHaveLength(1)
  })
})
