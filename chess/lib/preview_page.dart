import 'dart:math';
import 'dart:typed_data';

import 'package:image/image.dart' as img;

import 'package:camera/camera.dart';
import 'package:chessproject/chess_page.dart';
import 'package:flutter/material.dart';
import 'dart:io';
import 'dart:convert';
import 'package:http/http.dart' as http;


class PreviewPage extends StatelessWidget {
  PreviewPage({Key? key, required this.picture}) : super(key: key);
  
  
  final XFile picture;

  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Preview Page')),
      body: Center(
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          Image.file(File(picture.path), fit: BoxFit.cover, width: 250),
          const SizedBox(height: 24),
          TextButton(
                  child: const Text("Send"),
                  onPressed: () async {
                    File imagefile = File(picture.path); //convert Path to File
                    Uint8List imagebytes = await imagefile.readAsBytes(); //convert to bytes
                    
                    String base64string = base64.encode(imagebytes); //convert bytes to base64 string
                    String data = (await post(base64string));
                    await Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => ChessPage(
                                fen: data,
                    )));  
                  }
                ),
        ]),
      ),
    );
  }
}


post(data) async {
  final String url = 'http://192.168.1.67:80/pic';

final Map<String, String> picdata = {
  'pic': data,
};

final http.Response response = await http.post(
  Uri.parse(url),
  headers: <String, String>{
    'Content-Type': 'application/json; charset=UTF-8',
  },
  body: jsonEncode(picdata),
  );
  
  //print(response.body);
  return response.body;

}