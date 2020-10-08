import React from 'react';
import { SafeAreaView, View } from 'react-native';
import {
  Icon,
  Divider,
  Header,
  Text,
} from 'react-native-elements'
import Padrao from '../styles/default'

const Sobre = ({navigation}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
     <Header
        placement="left"
        centerComponent={{ text: 'Chofer App', style: { color: Padrao.color_1.color, fontWeight: 'bold', fontSize: 30 } }}
        leftComponent={
          <Icon name='menu' color='#fff' onPress={()=> navigation.openDrawer()}/>
        }
        containerStyle={{
          backgroundColor: '#78bc6d',
        }}
      />
      <View style= {{flex: 1, margin: 10}}>
        <Text style={{fontSize: 24}}>Essa aplicação foi desenvolvida como Projeto de Final de Curso (PFC) do curso de Sistemas de Informação da Universidade Federal de Goiás (UFG).</Text>
        <Divider style={{marginTop: 10}}/>

        <Text style={{fontSize: 18, marginTop: 10}}>Aluno: Vitor de Lima Cirqueira</Text>
        <Text style={{fontSize: 18}}>Orientador: Ricardo Augusto Pereira Franco</Text>
        <Divider style={{marginTop: 10}}/>
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 18, marginTop: 10 ,alignItems: 'center'}}>Link para o repositório no Github: </Text>
        </View>
        <View style={{flex:1, flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
          <Text style={{fontSize: 18, color:'#0077ff'}}>ChoferApp </Text>
          <Icon name='github' type='font-awesome' color='#0077ff' />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Sobre;