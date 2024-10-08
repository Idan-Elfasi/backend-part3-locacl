import { ObjectId } from 'mongodb'

import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

export const toyService = {
    remove,
    query,
    getById,
    add,
    update,
    addToyMsg,
    removeToyMsg,
}

async function query(filterBy = {}, sortBy = {}, pageIdx) {
    try {
        const labels = filterBy.labels && filterBy.labels.length ? { labels: { $all: filterBy.labels } } : {}
        const stock = filterBy.inStock === 'true' ? { inStock: true }
            : filterBy.inStock === 'false' ? { inStock: false } : {}
        // console.dir(`filterBy service: ${filterBy.inStock}`);
        const criteria = {
            $and: [
                { name: { $regex: filterBy.txt, $options: 'i' } },
                stock,
                labels,
            ]
        }
        const sort={}
        sort[sortBy.type] = +sortBy.desc
        const sortMongo = !sortBy.type ?{}:sort

        // db.toy.updateMany(
        //     {},
        //     [
        //       {
        //         $set: {
        //           date: {
        //             $cond: {
        //               if: { $not: ["$date"] },
        //               then: "$_id.getTimestamp()",
        //               else: "date"
        //             }
        //           }
        //         }
        //       }
        //     ],
        //   );
        const collection = await dbService.getCollection('toy')
        var toys = await collection.find(criteria).sort(sortMongo).toArray()
        return toys
    } catch (err) {
        loggerService.error('cannot find toys', err)
        throw err
    }
}

async function getById(toyId) {
    console.log(toyId);
    try {
        const collection = await dbService.getCollection('toy')
        const toy = await collection.findOne({ _id: ObjectId.createFromHexString(toyId) })
        toy.createdAt = toy._id.getTimestamp()
        return toy
    } catch (err) {
        loggerService.error(`while finding toy ${toyId}`, err)
        throw err
    }
}

async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        const { deletedCount } = await collection.deleteOne({ _id: ObjectId.createFromHexString(toyId) })
        return deletedCount
    } catch (err) {
        loggerService.error(`cannot remove toy ${toyId}`, err)
        throw err
    }
}

async function add(toy) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.insertOne(toy)
        return toy
    } catch (err) {
        loggerService.error('cannot insert toy', err)
        throw err
    }
}

async function update(toy) {
    try {
        const toyToSave = {
            name: toy.name,
            price: toy.price,
        }
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: ObjectId.createFromHexString(toy._id) }, { $set: toyToSave })
        return toy
    } catch (err) {
        loggerService.error(`cannot update toy ${toy._id}`, err)
        throw err
    }
}

async function addToyMsg(toyId, msg) {
    try {
        msg.id = utilService.makeId()

        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: ObjectId.createFromHexString(toyId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        loggerService.error(`cannot add toy msg ${toyId}`, err)
        throw err
    }
}

async function removeToyMsg(toyId, msgId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: ObjectId.createFromHexString(toyId) }, { $pull: { msgs: { id: msgId } } })
        return msgId
    } catch (err) {
        loggerService.error(`cannot add toy msg ${toyId}`, err)
        throw err
    }
}