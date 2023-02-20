import 'package:flutter/material.dart';
import 'dart:math';
import 'package:flutter_chess_board/flutter_chess_board.dart';


class ChessPage extends StatefulWidget {
  ChessPage({Key? key, required this.fen}) : super(key: key);


  String fen;

  @override
  _ChessPageState createState() => _ChessPageState();
}

class _ChessPageState extends State<ChessPage>{
  ChessBoardController controller = ChessBoardController();
  
  @override
  Widget build(BuildContext context) {
    print((widget.fen));
    ChessBoardController controller = ChessBoardController();
    controller.loadFen(widget.fen);
    return Scaffold(
      appBar: AppBar(
        title: const Text('Best move is...'),
      ),
      body: 
        Center(
              child: ChessBoard(
                controller: controller,
                boardColor: BoardColor.orange,
                arrows: [
                  BoardArrow(
                    from: 'c3',
                    to: 'c1',
                    //color: Colors.red.withOpacity(0.5),
                  )
                ],
                boardOrientation: PlayerColor.white,
              ),
            ),
      
    );
  }
}