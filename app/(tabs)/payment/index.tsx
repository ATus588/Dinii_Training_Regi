import OrderDetail from "@/components/order/OrderDetail";
import Transaction from "@/components/order/Transaction";
import text from "@/constants/text";
import { EOrderStatus, useOrdersSubscription } from "@/gql/schema";
import dayjs from "dayjs";
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
  const { data: ordersData } = useOrdersSubscription();
  const [orderId, setOrderId] = useState<number | null>(null);

  if (!ordersData?.orders.length) return <Text>{text.noData}</Text>;

  return (
    <SafeAreaView>
      <View className=" flex-row h-full gap-2 p-2 pb-0">
        <View className="flex-1 bg-white h-full rounded-xl">
          <FlatList
            className="p-2"
            data={ordersData.orders}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setOrderId(item.id)}>
                <View
                  className={
                    "flex-row h-14 justify-between items-center rounded-lg overflow-hidden " +
                    (item.id === orderId ? "bg-primary" : "")
                  }
                >
                  <View className="p-2">
                    <Text
                      className={
                        "mb-2 " + (item.id === orderId ? "text-white" : "")
                      }
                    >
                      {text.yen}
                      {item.total}
                    </Text>
                    <Text className={item.id === orderId ? "text-white" : ""}>
                      {dayjs(item.createdAt).format("MM月DD日 HH:MM")}
                    </Text>
                  </View>
                  <Text
                    className={
                      "px-2 " + (item.id === orderId ? "text-white" : "")
                    }
                  >
                    {item.status === EOrderStatus.Pending
                      ? text.unpaid
                      : text.paid}
                  </Text>
                </View>
                <View className="border-[0.5px] border-slate-300 my-2" />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
        <View className="flex-[2] bg-white h-full rounded-xl">
          {orderId ? (
            <OrderDetail orderId={orderId} />
          ) : (
            <View className="justify-center h-full">
              <Text className="text-center mt-4">
                {text.selectOrderMessage}
              </Text>
            </View>
          )}
        </View>
        <View className="flex-1 bg-white h-full rounded-xl">
          {orderId ? (
            <Transaction orderId={orderId} />
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
