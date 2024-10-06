import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question-factory'
import { FetchRecentQuestionUseCase } from './fetch-recent-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
// sistem under test
let sut: FetchRecentQuestionUseCase
describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new FetchRecentQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to fetch a recent questions', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 20) }),
    )
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2023, 0, 20) }),
    )
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 2, 19) }),
    )

    const { questions } = await sut.execute({
      page: 1,
    })

    expect(questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 2, 19) }),
      expect.objectContaining({ createdAt: new Date(2023, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
    ])
  })

  it('should be able to fetch paginated recent questions', async () => {
    for (let i = 1; i <= 21; i++) {
      await inMemoryQuestionsRepository.create(makeQuestion())
    }

    const questionsPageOne = await sut.execute({
      page: 1,
    })

    const questionsPageTwo = await sut.execute({
      page: 2,
    })
    expect(questionsPageOne.questions).toHaveLength(20)
    expect(questionsPageTwo.questions).toHaveLength(1)
  })
})
