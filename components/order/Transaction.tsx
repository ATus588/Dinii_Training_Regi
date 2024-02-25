import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  EOrderStatus,
  OrderDetailDocument,
  useOrderDetailQuery,
  useUpdateOrderMutation,
} from "@/gql/schema";
import text from "@/constants/text";
import { useToast } from "react-native-toast-notifications";

type Props = {
  orderId: number;
};

const Transaction = ({ orderId }: Props) => {
  const [deposit, setDeposit] = useState<number>(0);
  const [depositError, setDepositError] = useState<string>("");
  const toast = useToast();
  const { data } = useOrderDetailQuery({
    variables: {
      id: orderId,
    },
  });

  const [updateOrder] = useUpdateOrderMutation();

  const handleUpdateOrder = async () => {
    if (depositError) return;
    const { data } = await updateOrder({
      variables: {
        updateOrderInput: {
          id: orderId,
          status: EOrderStatus.Completed,
          deposit,
        },
      },
      refetchQueries: [
        { query: OrderDetailDocument, variables: { id: orderId } },
      ],
    });
    if (data?.updateOrder.data?.affected) {
      toast.show(text.paymentSuccess, {
        type: "success",
        placement: "bottom",
        duration: 3000,
        // offset: 30,
        animationType: "slide-in",
      });
      setDeposit(0);
    } else {
      toast.show(text.paymentFailed, {
        type: "error",
        placement: "bottom",
        duration: 3000,
        // offset: 30,
        animationType: "slide-in",
      });
    }
  };

  useEffect(() => {
    if (data?.orders_by_pk?.deposit) {
      setDeposit(data.orders_by_pk.deposit);
    } else {
      setDeposit(0);
    }
    setDepositError("");
  }, [orderId]);

  if (!data?.orders_by_pk?.orderItems) return <Text>{text.noData}</Text>;

  const subTotal = data.orders_by_pk.total;
  const tax = subTotal * 0.1;
  const total = subTotal + tax;

  return (
    <View className="p-4">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="gap-4"
      >
        <View className="flex-row justify-between">
          <Text>{text.subTotal}</Text>
          <Text>
            {text.yen}
            {subTotal}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text>{text.tax}</Text>
          <Text>
            {text.yen}
            {tax}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text>{text.total}</Text>
          <Text>
            {text.yen}
            {total}
          </Text>
        </View>
        <View>
          <View className="flex-row justify-between items-center">
            <Text>{text.deposit}</Text>
            <View>
              {data.orders_by_pk.status === EOrderStatus.Pending ? (
                <TextInput
                  className={
                    "h-8 w-24 p-1 text-right border border-solid " +
                    (depositError ? " border-red-500" : " border-black")
                  }
                  keyboardType="numeric"
                  onChangeText={(textInput) => {
                    let deposit = Number(textInput.replace(/[^0-9]/g, ""));
                    if (deposit > 10000000) deposit = 9999999;
                    setDeposit(deposit);
                    if (deposit < total) {
                      setDepositError(text.depositError);
                    } else {
                      setDepositError("");
                    }
                  }}
                  value={deposit ? deposit.toString() : ""}
                />
              ) : (
                <Text>
                  {text.yen}
                  {data.orders_by_pk.deposit}
                </Text>
              )}
            </View>
          </View>
          {depositError && (
            <Text className="text-right mt-2 text-red-500">
              {text.depositError}
            </Text>
          )}
        </View>
        <View className="flex-row justify-between">
          <Text>{text.change}</Text>
          <Text>
            {data.orders_by_pk.deposit
              ? data.orders_by_pk.deposit - total
              : deposit - total > 0
              ? `${text.yen} ${deposit - total}`
              : ""}
          </Text>
        </View>

        {data.orders_by_pk.status === EOrderStatus.Pending && (
          <TouchableOpacity
            className="bg-primary p-4 items-center rounded-lg"
            onPress={handleUpdateOrder}
          >
            <Text className="text-white">{text.payment}</Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default Transaction;
