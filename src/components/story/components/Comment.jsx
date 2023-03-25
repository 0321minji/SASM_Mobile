import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { View, Text, TouchableOpacity, Image, TextInput, Alert, FlatList } from 'react-native';
import { Request } from '../../../common/requests';

const TextButton = ({text, onPress}) => {
    return (
        <TouchableOpacity
            onPress = {onPress}>
            <Text>{text}</Text>
        </TouchableOpacity>
    )
}

const Comment = ({ data, reRenderScreen }) => {
    const date = data.created_at.slice(0, 10);
    const [update, setUpdate] = useState(false);
    const [updateText, setUpdateText] = useState(data.content);
    const request = new Request();

    const handleUpdate = () => {
        setUpdate(!update);
    }
    const deleteComment = async () => {
        const _delete = async () => {
            await request.delete(`/stories/comments/${data.id}/`, {});
            reRenderScreen();
        }
        Alert.alert(
            "댓글 삭제 확인",
            "정말로 삭제하시겠습니까?",
            [
                {
                    text: "삭제",
                    onPress: () => _delete(),

                },
                {
                    text: "취소",
                    onPress: () => { },
                    style: "cancel"
                },
            ],
            { cancelable: false }
        );
    }
    
    const updateComment = async () => {
        const response = await request.patch(`/stories/comments/${data.id}/`, {
            content: updateText,
        });
        Alert.alert("댓글이 수정되었습니다.");
        reRenderScreen();
    }
    // let isWriter = false;
    // if (data.email == email) {
    //     isWriter = true;
    // }
    return (
        <View>
            <View style = {{ flexDirection: 'row' }}>
                <Image src = {data.profile_image}
                    style = {{
                        width: 36,
                        height: 36,
                        borderRadius: 50,
                    }} />
                <Text>{data.nickname}</Text>
                <Text>{date}</Text>
                {update ?
                    <>
                        <TextButton onPress = {updateComment} text = '저장' />
                        <TextButton onPress = {handleUpdate} text = '취소' />
                    </>
                    :
                    <>
                        <TextButton onPress = {() => {
                            handleUpdate();
                        }}
                            text = '수정'
                            style = {{ }} />
                        <TextButton onPress = {deleteComment} text = '삭제' />
                    </>
                }
            </View>
            <View>
                {update ? 
                    <>
                        <TextInput
                            value = {updateText}
                            onChangeText = {setUpdateText}
                            style = {{
                                borderColor: 'rgba(0, 0, 0, 0.3)',
                                borderRadius: 24,
                                borderWidth: 1,
                                width: 260,
                                height: 24,
                                textAlign: 'center'
                            }}
                         />
                    </>
                    :
                    <><Text>{data.content}</Text></>
                }
            </View>
        </View>
    )
}

export default Comment;