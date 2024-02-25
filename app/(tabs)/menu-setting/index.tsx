import text from "@/constants/text";
import {
  MenusDocument,
  useMenusQuery,
  useUpdateMenuMutation,
} from "@/gql/schema";
import { Entypo } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  Switch,
  Text,
  View,
} from "react-native";

type Props = {};

const Menus = (props: Props) => {
  const navigation = useNavigation();
  const router = useRouter();
  const [updateMenu] = useUpdateMenuMutation();
  const { data } = useMenusQuery();
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const toggleSwitch = async (id: number, isDisplay: boolean) => {
    const { data } = await updateMenu({
      variables: {
        updateMenuInput: {
          id,
          isDisplay: !isDisplay,
        },
      },
      refetchQueries: [{ query: MenusDocument }],
      onCompleted: () => {
        setLoadingId(null);
      },
    });
    // if (data) {
    //   setTimeout(() => {
    //     setLoadingId(null);
    //   }, 500);
    // }
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoadingId(null);
  //   }, 1000);
  // }, [loadingId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      title: text.menuSetting,
      headerRight: () => (
        <Pressable className="mr-4" onPress={() => router.push("/create-menu")}>
          <Entypo name="plus" size={28} color="black" />
        </Pressable>
      ),
    });
  }, []);

  if (!data?.menus) return null;

  return (
    <SafeAreaView className="box-border">
      <View className="p-2">
        <View className="bg-white rounded-lg h-full p-2">
          <View className="">
            <View>
              <Text className="text-lg text-right px-4 mb-2">
                {text.display}
              </Text>
            </View>
            <View className="border-[0.5px] mb-3 border-slate-300" />
          </View>
          <FlatList
            className=""
            data={data.menus}
            renderItem={({ item }) => (
              <View className="p-1 mx-2">
                <View className="flex-row justify-between">
                  <View className="flex-row items-center">
                    <Image
                      className="h-14 w-14"
                      resizeMode="cover"
                      source={{ uri: item.avatar }}
                    />
                    <View className="mx-2 mb-1">
                      <Text>{item.name}</Text>
                      <Text>
                        {text.yen}
                        {item.price}
                      </Text>
                    </View>
                  </View>
                  <View className="justify-center">
                    {loadingId === item.id ? (
                      <ActivityIndicator />
                    ) : (
                      <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={item.isDisplay ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => {
                          toggleSwitch(item.id, item.isDisplay);
                          setLoadingId(item.id);
                        }}
                        value={item.isDisplay}
                      />
                    )}
                  </View>
                </View>
                <View className="border-[0.5px] border-slate-300 mt-3" />
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Menus;
