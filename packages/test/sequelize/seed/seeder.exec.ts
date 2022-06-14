import { seeder } from './seeder'

;await (async ()=>{
    console.log('execute seeding')
    await seeder.down()
    await seeder.up()
})()
