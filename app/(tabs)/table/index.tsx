import { ETableStatus, useGetTablesQuery } from "@/gql/schema";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { useToast } from "react-native-toast-notifications";
import text from "@/constants/text";
import TableCard from "@/components/table/TableCard";


const Tables = () => {

  const navigation = useNavigation();
  const { data } = useGetTablesQuery();
  const toast = useToast();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      title: text.menu,
      // headerRight: () => (
      //   <Pressable className="mr-4" onPress={() => router.push("/create-menu")}>
      //     <FontAwesome5 name="shopping-cart" size={20} color="black" />
      //   </Pressable>
      // ),
    });
  }, []);



  if (!data?.getTables.data) return null;
  return (
    <SafeAreaView className="">
      <View className="p-2">
        <View className="bg-white rounded-lg h-full p-5 flex flex-row flex-wrap">
          {data.getTables.data && data.getTables.data.map((item) => {
            return (<TableCard {...item} key={item.id}/>)
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Tables;
