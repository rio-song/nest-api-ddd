import { Pair } from '../entity/pair'

export interface IPairRepository {
    save(Pair: Pair): Promise<Pair>
}