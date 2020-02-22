import Realm from "realm";

export const USER_LENGH = "user_lengh";

//define leng table schema
export const UserLeng = {
  name: USER_LENGH,
  primaryKey: "id",
  properties: {
    id: "int", // primary key
    leng: "string"
  }
};

//create database option for create database
const databaseOptions = {
  path: "Demo.realm",
  schema: [UserLeng],
  schemaVersion: 2 //optional
};

//functions for Insert user
export const insertleng = leng =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          realm.create(USER_LENGH, leng);
          resolve(leng);
        });
      })
      .catch(error => reject(error));
  });

// update DataBase function
export const updateLeng = leng =>
  new Promise((resolve, reject) => {
    console.warn("updateLeng", leng);
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          let updatingData = realm.objectForPrimaryKey(USER_LENGH, leng.id);
          console.warn(updatingData);
          updatingData.leng = data.leng;
          resolve();
        });
      })
      .catch(error => reject(error));
  });

//function for get Function
export const getLeng = () =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        const leng = realm.objects(USER_LENGH);
        resolve(leng);
      })
      .catch(error => {
        reject(error);
      });
  });

// Delete Function
export const deleteLeng = () =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          const leng = realm.objects(USER_LENGH);
          realm.delete(leng);
          resolve();
        });
      })
      .catch(error => reject(error));
  });

export default new Realm(databaseOptions);
