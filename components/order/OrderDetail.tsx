import text from "@/constants/text";
import { useOrderDetailQuery } from "@/gql/schema";
import { FlatList, Image, Text, View } from "react-native";

type Props = {
  orderId: number;
};

const OrderDetail = ({ orderId }: Props) => {
  const { data } = useOrderDetailQuery({
    variables: {
      id: orderId,
    },
  });
  if (!data?.orders_by_pk?.orderItems) return <Text>{text.noData}</Text>;

  return (
    <View>
      <FlatList
        className="p-2"
        data={data.orders_by_pk.orderItems}
        renderItem={({ item }) => (
          <View>
            <View className="flex-row justify-between px-4 items-center">
              <View className="flex-row items-center flex-[4]">
                <Image
                  className="h-14 w-14"
                  resizeMode="cover"
                  source={{ uri: item.menu.avatar }}
                />
                <View className="mx-2">
                  <Text className="max-w-[260px] mb-1">{item.menu.name}</Text>
                  <Text>{item.menu.price}</Text>
                </View>
              </View>
              <View className="flex-1">
                <Text>x {item.quantity}</Text>
              </View>
              <View className="flex-1">
                <Text>
                  {text.yen}
                  {item.quantity * item.menu.price}
                </Text>
              </View>
              <View className="border-[0.5px] border-slate-300 my-2" />
            </View>
            <View className="border-[0.5px] border-slate-300 my-2" />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default OrderDetail;
