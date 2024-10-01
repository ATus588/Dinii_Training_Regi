import text from "@/constants/text";
import { GetUnpaidOrderItemsByTableIdQuery } from "@/gql/schema";
import { FlatList, Image, Text, View } from "react-native";

type OrderDetailProps = {
  orderItems: GetUnpaidOrderItemsByTableIdQuery["orderItems"];
};

const OrderDetail: React.FC<OrderDetailProps> = ({ orderItems }) => {
  if (!orderItems.length)
    return <Text className="text-center mt-20 text-base">{text.noData}</Text>;

  return (
    <View>
      <FlatList
        className="p-2"
        data={orderItems}
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
                  <Text>{item.price}</Text>
                </View>
              </View>
              <View className="flex-1">
                <Text>x {item.quantity}</Text>
              </View>
              <View className="flex-1">
                <Text>
                  {text.yen}
                  {item.quantity * item.price}
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
