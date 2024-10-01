import OrderDetail from "@/components/order/OrderDetail";
import Transaction from "@/components/order/Transaction";
import text from "@/constants/text";
import {
  GetUnpaidOrderItemsByTableIdQuery,
  useGetUnpaidOrderItemsByTableIdLazyQuery,
  useGetUnpaidTablesQuery,
} from "@/gql/schema";
import dayjs from "dayjs";
import { useGlobalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {};

const index = (props: Props) => {
  const {
    data: unpaidTablesData,
    loading,
    refetch,
  } = useGetUnpaidTablesQuery({
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
  });
  const [getUnpaidOrderItemsByTableId] =
    useGetUnpaidOrderItemsByTableIdLazyQuery();
  const [orderItems, setOrderItems] = useState<
    GetUnpaidOrderItemsByTableIdQuery["orderItems"]
  >([]);
  const { tableId } = useGlobalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const getOrderedItems = async () => {
      if (!Array.isArray(tableId)) {
        await getUnpaidOrderItemsByTableId({
          variables: {
            tableId: parseInt(tableId),
          },
          onCompleted: (data) => {
            setOrderItems(data.orderItems);
          },
        });
      }
    };

    getOrderedItems();
  }, [tableId]);

  if (!unpaidTablesData?.getUnpaidTables.data.length) {
    return (
      <Text className="text-center mt-20 text-lg">{text.noUnPaidTable}</Text>
    );
  }

  return (
    <SafeAreaView>
      <View className=" flex-row h-full gap-2 p-2 pb-0">
        <View className="flex-1 bg-white h-full rounded-xl">
          <FlatList
            className="p-2"
            data={unpaidTablesData.getUnpaidTables.data}
            refreshing={loading}
            onRefresh={refetch}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  router.replace({
                    pathname: "/payment/",
                    params: { tableId: item.id },
                  })
                }
              >
                <View
                  className={
                    "flex-row h-14 justify-between items-center rounded-lg overflow-hidden " +
                    (!Array.isArray(tableId) && item.id === parseInt(tableId)
                      ? "bg-primary"
                      : "")
                  }
                >
                  <View className="p-2">
                    <Text
                      className={
                        "mb-2 " +
                        (!Array.isArray(tableId) &&
                        item.id === parseInt(tableId)
                          ? "text-white"
                          : "")
                      }
                    >
                      {item.name}
                    </Text>
                    <Text
                      className={
                        !Array.isArray(tableId) && item.id === parseInt(tableId)
                          ? "text-white"
                          : ""
                      }
                    >
                      {dayjs(item.openAt).format("MM月DD日 HH:MM")}
                    </Text>
                  </View>
                  <Text
                    className={
                      "px-2 " +
                      (!Array.isArray(tableId) && item.id === parseInt(tableId)
                        ? "text-white"
                        : "")
                    }
                  >
                    {text.yen}
                    {item.total}
                  </Text>
                </View>
                <View className="border-[0.5px] border-slate-300 my-2" />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
        <View className="flex-[2] bg-white h-full rounded-xl">
          {tableId ? (
            <OrderDetail orderItems={orderItems} />
          ) : (
            <View className="justify-center h-full">
              <Text className="text-center mt-4">
                {text.selectOrderMessage}
              </Text>
            </View>
          )}
        </View>
        <View className="flex-1 bg-white h-full rounded-xl">
          {tableId && !Array.isArray(tableId) ? (
            <Transaction
              orderItems={orderItems}
              setOrderItems={setOrderItems}
              tableId={parseInt(tableId)}
            />
          ) : (
            <View className="justify-center h-full">
              <Text className="text-center mt-4">
                {text.selectOrderMessage}
              </Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default index;
