using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cryptofolio.Data;
using Cryptofolio.Models;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.AspNetCore.OData.Query;
using Cryptofolio.ViewModels;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Deltas;
using Cryptofolio.Services;

namespace Cryptofolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ODataController
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserAuthService _userAuthService;

        public CommentsController(ApplicationDbContext context, IUserAuthService userAuthService)
        {
            _context = context;
            _userAuthService = userAuthService;
        }

        // GET: api/Comments
        [EnableQuery]
        [HttpGet("/odata/Comments")]
        public ActionResult<List<CommentDTO>> GetComments(string CoinSymbol)
        {
            if (_context.Comments == null && _userAuthService.getCurrentUserId() == null)
            {
                return NotFound();
            }
            else if (_context.Comments != null && _userAuthService.getCurrentUserId() != null)
            {
                List<CommentDTO> comments = _context.Comments.Where(cs => cs.CoinSymbol == CoinSymbol).Include(c => c.ApplicationUser).Select(comments => new CommentDTO(comments, _userAuthService.getCurrentUserId())).ToList();
                return Ok(comments);
            }
            else return BadRequest();
         }

        // GET: api/Comments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Comment>> GetComment(int id)
        {
          if (_context.Comments == null)
          {
              return NotFound();
          }
            var comment = await _context.Comments.FindAsync(id);

            if (comment == null)
            {
                return NotFound();
            }

            return comment;
        }

        // PUT: api/Comments/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [EnableQuery]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutComment(int id, [FromODataBody] CommentDTO commentDTO)
        {
            Comment? comment = await _context.Comments.FirstOrDefaultAsync(x => x.Id == id);

            if (comment == null)
            {
                if (id != comment.Id)
                {
                    return BadRequest();
                }
                comment.Id = commentDTO.Id;
                comment.Text = commentDTO.Text;
                comment.Date = commentDTO.Date;
                comment.ApplicationUserId = commentDTO.ApplicationUserId;

                _context.Entry(comment).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CommentExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

            }
            return NoContent();
        }

        [HttpPatch("{key}")]
        public async Task<IActionResult> Patch([FromODataUri] int key, Delta<CommentDTO> commentDTO)
        {
            if (_context.Comments == null)
            {
                return Problem("Entity set 'ApplicationDbContext.Comments'  is null.");
            }
            if (_userAuthService.getCurrentUserId() is null)
            {
                return Problem("Access denied");
            }

            var entity = await _context.Comments.FindAsync(key);

            if (entity == null)
            {
                return NotFound();
            }


            Delta<Comment> deltaComment = CommentDTO.toDeltaComment(commentDTO);

            deltaComment.Patch(entity);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CommentExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return Updated(entity);

        }

        // POST: api/Comments
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [EnableQuery]
        [HttpPost("/odata/Comments")]
        public async Task<ActionResult<Comment>> PostComment(CommentDTO commentDTO)
        {
            if (_context.Comments == null)
            {
                return Problem("Entity set 'ApplicationDbContext.Comments'  is null.");
            }
 

            else if (_userAuthService.getCurrentUserId() != null)
            {


                Coin coins = _context.Coins.Find(commentDTO.CoinSymbol.ToString());

                if (coins == null)
                {

                    Coin coin = new Coin();

                    coin.Symbol = commentDTO.CoinSymbol.ToString();

                    _context.Coins.Add(coin);
                    await _context.SaveChangesAsync();
                }

 


/*                if (_context.Coins.FirstOrDefault(coin) == null)
                {
                    _context.Coins.Add(coin);
                *//*    await _context.SaveChangesAsync();*//*
                }*/


                Comment comment = commentDTO.convertToComment();
                //TODO: Add IDs based on claims


                comment.ApplicationUserId = _userAuthService.getCurrentUserId();
                comment.Id = 0;
                comment.Date = DateTime.Now;
                _context.Comments.Add(comment);
                await _context.SaveChangesAsync();

                commentDTO.Id = comment.Id;
                commentDTO.ApplicationUserId = comment.ApplicationUserId;
                commentDTO.Name = _userAuthService.getCurrentUserName();
                commentDTO.Date = comment.Date;
                commentDTO.CoinSymbol = comment.CoinSymbol;
                commentDTO.IsEditable = true;
                return CreatedAtAction("GetComment", new { id = commentDTO.Id }, commentDTO);
            }
            else
            {
                return BadRequest();
            }
        }

        // DELETE: api/Comments/5
        [EnableQuery]
        [HttpDelete("/odata/Comments({id})")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            if (_context.Comments == null)
            {
                return NotFound();
            }
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
            {
                return NotFound();
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CommentExists(int id)
        {
            return (_context.Comments?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
